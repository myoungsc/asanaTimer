import { Lottie } from '@crello/react-lottie';
import animationData from '../../Resource/Lottie/lottie-loading.json';
import '../css/LoadingAnimation.css';

export const LoadingAnimation = () => {
  return (
    <div className="view">
      <div className="view_content">
        <Lottie
          width="150px"
          height="150px"
          className="lottie-container basic"
          config={{ animationData: animationData, loop: true, autoplay: true }}
        />
      </div>
    </div>
  );
};
