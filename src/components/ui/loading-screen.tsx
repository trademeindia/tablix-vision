import React from "react";

interface Props {
  message?: string;
}

const LoadingScreen: React.FC<Props> = ({ message = "Loading..." }) => {
  return (
    
      
        <span>Loading...</span>
      
    
  );
};

export default LoadingScreen;
