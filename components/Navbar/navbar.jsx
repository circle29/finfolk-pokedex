"use client";
import { React, useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

export const Navbar = () =>
  // { loadingLogin, user, handleSignIn, handleSignOut }
  {
    const [loadingLogin, setLoadingLogin] = useState(true);
    const { user, googleSignIn, logOut } = UserAuth();

    const handleSignIn = async () => {
      try {
        await googleSignIn();
      } catch (error) {
        console.log(error);
      }
    };
    const handleSignOut = async () => {
      try {
        await logOut();
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      const checkAuthentication = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setLoadingLogin(false);
      };
      checkAuthentication();
    }, [user]);

    return (
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-pokeballRed font-bold">Pokedex</h1>
        {loadingLogin ? null : !user ? (
          <div>
            <button className="customButton" onClick={handleSignIn}>
              Login
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <p>welcome, {user.displayName}</p>
            <button onClick={handleSignOut} className="customButton">
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  };
