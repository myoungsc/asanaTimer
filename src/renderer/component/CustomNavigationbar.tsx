/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/require-default-props */
import { useHistory } from 'react-router-dom';

import '../css/CustomNavigationbar.css';
import back_arrow from '../../Resource/Image/back_arrow.png';

const CustomNavigationbar = ({
  before,
  isBackBtn,
  naviTitle,
  isRightBtn,
  isRightText,
  isRightBtnMethod,
}: {
  before: string;
  isBackBtn: boolean;
  naviTitle: string;
  isRightBtn?: boolean;
  isRightText?: string;
  isRightBtnMethod?: any;
}) => {
  const history = useHistory();
  const moveToBack = () => {
    history.push(before);
  };

  return (
    <div className="CustomNavigationbar">
      <div className="CustomNavigationbar-content">
        {isBackBtn ? (
          <button
            type="button"
            onClick={moveToBack}
            className="CustomNavigationbar-back-button"
          >
            <img
              className="CustomNavigationbar-back-button-image"
              src={back_arrow}
              alt="a"
            />
          </button>
        ) : (
          <div className="CustomNavigationbar-size" />
        )}
        <div className="CustomNavigationbar-title-view">
          <h1 className="CustomNavigationbar-title">{naviTitle}</h1>
        </div>

        <div className="CustomNavigationbar-size">
          {isRightBtn ? (
            <div>
              <button
                type="button"
                className="CustomNavigationbar-right-button"
                onClick={isRightBtnMethod}
              >
                <label className="CustomNavigationbar-right-text">
                  {isRightText}
                </label>
              </button>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
      <div className="CustomNavigationbar-line" />
    </div>
  );
};

export default CustomNavigationbar;
