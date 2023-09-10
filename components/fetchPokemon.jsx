"use client";

import { React, useState, useEffect } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { client } from "@/ApolloClient";
import Image from "next/image";
import pokeball from "../public/pokeball.png";
import { HeartIcon } from "@heroicons/react/24/solid";
import { SearchForm } from "./searchForm/searchForm";
import { UserAuth } from "./context/AuthContext";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  getDocs,
  where,
  doc,
} from "firebase/firestore";
import { db } from "@/app/firebase";

const GET_POKEMON_DETAILS = gql`
  {
    getAllPokemon(offset: 89, take: 1392) {
      key
      sprite
      backSprite
      species
      baseStats {
        attack
        defense
        hp
        specialattack
        specialdefense
        speed
      }
      types {
        name
      }
    }
  }
`;

export const Pokemon = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUniquePokemon, setFilteredUniquePokemon] = useState([]);
  const [likedPokemon, setLikedPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isCurrentPokemonLiked, setIsCurrentPokemonLiked] = useState(null);
  const [showLikedPokemon, setShowLikedPokemon] = useState(false);

  const { user } = UserAuth();

  const { loading, error, data } = useQuery(GET_POKEMON_DETAILS, {
    client: client,
  });

  useEffect(() => {
    if (user != null) getLikedPokemon();
  }, [user]);

  const getLikedPokemon = async () => {
    console.log("Skadidap");
    const queryLikedPokemon = query(
      collection(db, "pokemon_data"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(queryLikedPokemon);
    setLikedPokemon(
      querySnapshot.docs.map((doc) => {
        return {
          docRef: doc.id,
          data: doc.data(),
        };
      })
    );
  };

  useEffect(() => {
    if (!loading && !error) {
      const limitPokemonOne = data.getAllPokemon;
      let filteredPokemon = limitPokemonOne.filter((pokemon) =>
        pokemon.species.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filteredUniquePokemon = [
        ...new Map(
          filteredPokemon.map((item) => [item["species"], item])
        ).values(),
      ];
      setFilteredUniquePokemon(filteredUniquePokemon);
    }
  }, [loading, error, data, searchQuery]);

  if (loading) return "Loading...";
  if (error) throw new Error(error.message);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    isPokemonLiked(pokemon);
  };

  const addPokemon = async () => {
    const data = {
      userId: user.uid,
      pokemonId: selectedPokemon.key,
    };
    const docRef = await addDoc(collection(db, "pokemon_data"), data);

    if (docRef) {
      getLikedPokemon();
    }
  };

  const deletePokemon = async () => {
    const deletedPokemon = likedPokemon.find(
      (item) => item.data.pokemonId === selectedPokemon.key
    );
    if (deletedPokemon) {
      const deleteResult = await deleteDoc(
        doc(db, "pokemon_data", deletedPokemon.docRef)
      );
      getLikedPokemon();
    }
  };

  const isPokemonLiked = (pokemon) => {
    if (user) {
      if (
        pokemon &&
        likedPokemon.find((item) => item.data.pokemonId === pokemon.key)
      ) {
        setIsCurrentPokemonLiked(true);
      } else {
        setIsCurrentPokemonLiked(false);
      }
    } else {
      setIsCurrentPokemonLiked(null);
    }
  };

  const handleLike = () => {
    if (isCurrentPokemonLiked === true) {
      setIsCurrentPokemonLiked(false);
      deletePokemon();
    } else {
      setIsCurrentPokemonLiked(true);
      addPokemon();
    }
  };

  const handleListLikedPokemon = () => {
    setShowLikedPokemon(!showLikedPokemon);
  };

  return (
    <div className="grid grid-cols-2 gap-1 border border-black md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
      <div className="flex h-screen flex-col sm:order-2 xs:order-2">
        <div>
          <div className=" text-center">
            <div className="text-center">
              <button className="customButton" onClick={handleListLikedPokemon}>
                Pokemon You Like
              </button>
            </div>
            <div>
              {showLikedPokemon && (
                <div className="grid xl:grid-cols-3 gap-0 overflow-auto inset-0 pt-5 md:grid-cols-2">
                  {likedPokemon.map((likedData) => {
                    const { docRef, data } = likedData;
                    const matchedPokemon = filteredUniquePokemon.find(
                      (pokemon) => pokemon.species === data.pokemonId
                    );

                    if (matchedPokemon) {
                      return (
                        <div key={docRef}>
                          <button
                            className="flex justify-center items-center flex-col"
                            onClick={() => handlePokemonClick(matchedPokemon)}
                          >
                            <img
                              src={matchedPokemon.sprite}
                              alt={matchedPokemon.species}
                              width={128}
                              height={128}
                            />
                          </button>
                          <h2>{matchedPokemon.species}</h2>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <SearchForm onSearch={handleSearch} />
        </div>
        <div className="grid xl:grid-cols-3 gap-0 overflow-auto inset-0 pt-5 md:grid-cols-2 ">
          {filteredUniquePokemon.map((pokemon) => (
            <button
              key={pokemon.species}
              className="flex justify-center items-center flex-col"
              onClick={() => handlePokemonClick(pokemon)}
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.species}
                className="object-contain w-48 aspect-square"
              />
              <h2>{pokemon.species}</h2>
            </button>
          ))}
        </div>
      </div>
      <div className="pokedex-box">
        <div className="flex flex-row items-center justify-center">
          <div className="pokedex-circle">
            <Image src={pokeball} alt="pokeball" width={144} height={144} />
          </div>
          <h6 className="font-bold text-3xl">POKEDEX</h6>
          <div className="pokedex-circle">
            <Image src={pokeball} alt="pokeball" width={144} height={144} />
          </div>
        </div>
        <div className="pokedex-screen w-3/4 h-96 sm: w-50 items-center justify-center">
          {selectedPokemon && (
            <>
              <img
                src={selectedPokemon.sprite}
                alt={selectedPokemon.species}
                width={256}
                height={256}
              />

              <h2 className=" font-bold text-xl">{selectedPokemon.species}</h2>
            </>
          )}
        </div>
        <div className="pokedex-button">
          <div className="flex justify-center items-center bg-gray-500 border border-black">
            {user ? (
              <button onClick={handleLike}>
                {isCurrentPokemonLiked ? (
                  <HeartIcon className="h-10 w-10 m-5 rounded-full shadow-sm fill-orange-500"></HeartIcon>
                ) : (
                  <HeartIcon className="h-10 w-10 m-5 rounded-full shadow-sm fill-white"></HeartIcon>
                )}
              </button>
            ) : (
              <p className="p-1">Please Register to like pokemon</p>
            )}
          </div>
          <div className="pokedex-screen">
            {selectedPokemon && (
              <div className="grid grid-cols-2 justify-center">
                <div>
                  <h2 className="font-bold xl: text-lg sm:text-sm pb-1">
                    Status
                  </h2>
                  <h2 className="font-bold text-sm">
                    sAtk{selectedPokemon.baseStats.specialattack}
                  </h2>
                  <h2 className="font-bold text-sm sm:text-xs">
                    def {selectedPokemon.baseStats.defense}
                  </h2>
                  <h2 className="font-bold  text-sm sm:text-xs">
                    HP{selectedPokemon.baseStats.hp}
                  </h2>
                  <h2 className="font-bold  text-sm sm:text-xs">
                    atk {selectedPokemon.baseStats.attack}
                  </h2>
                  <h2 className="font-bold  text-sm sm:text-xs">
                    sDef{selectedPokemon.baseStats.specialdefense}
                  </h2>
                  <h2 className="font-bold text-sm sm:text-xs">
                    Speed {selectedPokemon.baseStats.speed}
                  </h2>
                </div>
                <div>
                  <h2 className="font-bold text-lg sm:text-sm pb-1">Types</h2>
                  <h2 className="font-bold  text-sm">
                    {selectedPokemon.types.map((type, index) => (
                      <h2 className="font-bold text-sm sm:text-xs" key={index}>
                        {type.name}
                      </h2>
                    ))}
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
