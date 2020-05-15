import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

export const createDialog = (
  title: string,
  message: string,
  onClickYes: () => void,
  onClickNo: (() => void) | null
) => {
  let buttons = [
    {
      label: "Yes",
      onClick: onClickYes,
    },
  ];
  if (onClickNo) {
    const noButton = {
      label: "No",
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
