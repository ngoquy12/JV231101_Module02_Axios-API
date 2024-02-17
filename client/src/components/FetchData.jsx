import React, { useEffect } from "react";

export default function FetchData() {
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);

  return <div>FetchData</div>;
}
