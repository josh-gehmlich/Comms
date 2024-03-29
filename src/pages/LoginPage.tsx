import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "../components/box";
import { Button } from "../components/button";
import { db } from "../config/firebase";

import IPageProps from "../interfaces/page.interface";
import { SignInWithSocialMedia } from "../modules/auth";

const LogInPage: React.FunctionComponent<IPageProps> = (props) => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const history = useHistory();

  const signInWithSocialMedia = () => {
    if (error !== "") setError("");

    setAuthenticating(true);

    SignInWithSocialMedia()
      .then(async (result) => {
        console.log(result);
        const q = query(
          collection(db, "users"),
          where("uid", "==", result.user.providerData[0].uid)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 0) {
          await setDoc(doc(db, "users", result.user.providerData[0].uid), {
            displayName: result.user.providerData[0].displayName,
            email: result.user.providerData[0].email,
            photoURL: result.user.providerData[0].photoURL,
            providerId: result.user.providerData[0].providerId,
            uid: result.user.providerData[0].uid,
            id: result.user.providerData[0].uid,
            display: `@${
              result.user.providerData[0].email.match(/^([^@]*)@/)[1]
            }`,
            userName: `@${
              result.user.providerData[0].email.match(/^([^@]*)@/)[1]
            }`,
          });
        }
        history.push("/");
      })
      .catch((error) => {
        setAuthenticating(false);
        setError(error.message);
      });
  };

  return (
    <Box
      css={{
        backgroundColor: "$white",
        color: "$black",
        fontSize: "$5",
        padding: "$4",
        marginLeft: "800px",
        marginTop: "400px",
      }}
    >
      <Button disabled={authenticating} onClick={() => signInWithSocialMedia()}>
        SignIn with Google
      </Button>
    </Box>
  );
};

export default LogInPage;
