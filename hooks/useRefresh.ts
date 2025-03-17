import { useState } from "react";

const useRefresh = (): [number, () => void] => {
  const [refreshKey, setRefreshKey] = useState(0); // change key to force re-render
  const handleRefreshState = () => {
    setRefreshKey((prevKey) => prevKey + 1); // update key to trigger re-render
  };

  return [refreshKey, handleRefreshState];
};

export default useRefresh;
