"use client";

import { StyleProvider } from '@ant-design/cssinjs';

export function AntdProvider({ children }) {
  return <StyleProvider>{children}</StyleProvider>;
}
