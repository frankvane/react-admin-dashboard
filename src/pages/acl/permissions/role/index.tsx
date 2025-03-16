import React, { useState } from "react";

import { Button } from "antd";

const Role = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数器: {count}</p>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        增加计数
      </Button>
    </div>
  );
};
export default Role;
