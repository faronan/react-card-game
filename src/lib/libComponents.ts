import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

export const createDialog = (
  title: string,
  message: string,
  onClickYes: () => void,
  onClickNo: (() => void) | null,
  yesButtonMessage = "Yes",
  noButtonMessage = "No"
) => {
  let buttons = [
    {
      label: yesButtonMessage,
      onClick: onClickYes,
    },
  ];
  if (onClickNo) {
    const noButton = {
      label: noButtonMessage,
      onClick: onClickNo,
    };
    buttons = buttons.concat([noButton]);
  }
  confirmAlert({
    title: title,
    message: message,
    buttons: buttons,
  });
};

export const createOkDialog = (title: string, message: string) => {
  let buttons = [
    {
      label: "OK",
      onClick: () => {},
    },
  ];
  confirmAlert({
    title: title,
    message: message,
    buttons: buttons,
  });
};
