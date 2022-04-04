import { ChangeEventHandler, Fragment, useState } from "react";
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, InputLabel, InputAdornment, IconButton, Alert, Collapse } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { auth } from "../firestore/firebaseApp";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { handleAuthError } from "../firestore/parseError";

interface Props {
  doClose: () => void,
}

// ref: https://mui.com/components/dialogs/

const MAIL_ADDRESS_INPUT_ID = "mailaddress-input";
const PASSWORD_INPUT_ID = "password-input";

const PASSWORD_FORMAT = /[\x21-\x7e]{6,}$/;

export const Auth = (props: Props) => {
  const [isEmailFormatInvalid, setIsEmailFormatInvalid] = useState(false);
  const [isEmailAlreadyInUse, setIsEmailAlreadyInUse] = useState(false);
  const [isEmailNotFound, setIsEmailNotFound] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isProcessingSignIn, setIsProcessingSignIn] = useState(false);
  const [isProcessingSignUp, setIsProcessingSignUp] = useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleFirebaseError = (reason: FirebaseError) =>
    handleAuthError(
      reason,
      setErrorMessage,
      setIsEmailAlreadyInUse,
      setIsEmailFormatInvalid,
      setIsEmailNotFound,
      setIsPasswordError,
    );

  const signInAction = () => {
    setIsProcessingSignIn(true);
    setIsEmailAlreadyInUse(false);

    signInWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((value) => {
        props.doClose();
      })
      .catch(handleFirebaseError)
      .finally(() => setIsProcessingSignIn(false));
  };
  const signUpAction = () => {
    setIsProcessingSignUp(true);
    setIsEmailNotFound(false);

    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((value) => {
        props.doClose();
      })
      .catch(handleFirebaseError)
      .finally(() => setIsProcessingSignUp(false));
  };

  const emailUpdated: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    const value = event.target.value;

    setEmailValue(value);
    setIsEmailFormatInvalid(false);
    setIsEmailAlreadyInUse(false);
    setIsEmailNotFound(false);
  };

  const passwordUpdated: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    const value = event.target.value;

    setPasswordValue(value);

    const validateResult = value.match(PASSWORD_FORMAT) ?? [undefined];
    setIsPasswordError(value !== validateResult[0]);
  };

  return (<Fragment>
    <DialogTitle>登録 / ログイン</DialogTitle>
    <DialogContent>
      <DialogContentText>
        各種サービスのアカウントを使用するか、メールアドレスとパスワードを用いてアカウント作成/ログインを行なってください。
      </DialogContentText>
      <InputLabel htmlFor={MAIL_ADDRESS_INPUT_ID}>メールアドレス</InputLabel>
      <Input
        id={MAIL_ADDRESS_INPUT_ID}
        value={emailValue}
        placeholder="example@example.com"
        onChange={emailUpdated}
        autoFocus
        margin="dense"
        type="email"
        fullWidth
        required
        error={isEmailAlreadyInUse || isEmailFormatInvalid || isEmailNotFound}
      />
      <InputLabel htmlFor={PASSWORD_INPUT_ID}>パスワード (英数字/半角記号6文字以上)</InputLabel>
      <Input
        id={PASSWORD_INPUT_ID}
        value={passwordValue}
        onChange={passwordUpdated}
        margin="dense"
        type={isPasswordVisible ? "text" : "password"}
        fullWidth
        required
        error={isPasswordError}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={`パスワードを${isPasswordVisible ? "非表示に" : "表示"}する`}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              onMouseDown={() => setIsPasswordVisible(!isPasswordVisible)}
            >{isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </DialogContent>
    <Collapse in={errorMessage.length > 0}>
      <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>
    </Collapse>
    <DialogActions style={{ display: "flex" }}>
      <Button
        onClick={props.doClose}
        variant="text"
        style={{ marginRight: "auto" }}
      >キャンセル
      </Button>
      <LoadingButton
        onClick={signUpAction}
        loading={isProcessingSignUp}
        disabled={isProcessingSignIn || isEmailFormatInvalid || isEmailAlreadyInUse || isPasswordError}
        variant="outlined"
      >アカウント作成
      </LoadingButton>
      <LoadingButton
        onClick={signInAction}
        loading={isProcessingSignIn}
        disabled={isProcessingSignUp || isEmailFormatInvalid || isEmailNotFound || isPasswordError}
        variant="contained"
      >ログイン
      </LoadingButton>
    </DialogActions>
  </Fragment>);
}

export default Auth;
