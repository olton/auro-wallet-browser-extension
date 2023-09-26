/**
 * speed up and speed cancel modal
 */
import cls from "classnames";
import i18n from "i18next";
import Button from "../Button";
import styles from "./index.module.scss";
import AdvanceMode from "../AdvanceMode";
import { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";

export const AdvancedModal = ({
  modalVisable = false,
  onConfirm = () => {},
  onClickClose = () => {},
  currentNonce = "",
  currentFee = "",
}) => {
  const onClickAdvance = useCallback(() => {
    setIsOpenAdvance((state) => !state);
  }, []);
  const [inputedFee, setInputedFee] = useState("");
  const [feeErrorTip, setFeeErrorTip] = useState("");

  const onFeeInput = useCallback(
    (e) => {
      setInputedFee(e.target.value);
      if (BigNumber(e.target.value).gt(10)) {
        setFeeErrorTip(i18n.t("feeTooHigh"));
      } else {
        setFeeErrorTip("");
      }
    },
    [i18n]
  );
  useEffect(() => {
    if (!modalVisable) {
      setInputedFee("");
      setFeeErrorTip("");
    }
  }, [modalVisable]);

  return (
    <>
      {modalVisable && (
        <div className={styles.outerContainer}>
          <div className={styles.innerContent}>
            <div className={styles.contentContainer}>
              <div className={styles.titleRow}>
                <span className={styles.rowTitle}>{i18n.t("advanceMode")}</span>
                <div className={styles.rightRow}>
                  <img
                    onClick={onClickClose}
                    className={styles.rowClose}
                    src="/img/icon_nav_close.svg"
                  />
                </div>
              </div>
            </div>
            <div className={styles.dividedLine} />
            <div className={styles.bottomContent}>
              <AdvanceMode
                onClickAdvance={onClickAdvance}
                isOpenAdvance={true}
                feeValue={inputedFee}
                feePlaceholder={currentFee}
                onFeeInput={onFeeInput}
                feeErrorTip={feeErrorTip}
                nonceValue={currentNonce}
                type={"modal"}
              />
            </div>
            <div className={cls(styles.bottomContainer)}>
              <Button onClick={() => onConfirm(inputedFee)}>
                {i18n.t("confirm")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
