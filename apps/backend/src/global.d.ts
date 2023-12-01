declare global {
  type RequiredKeys<Type, Key extends keyof Type> = Type & {
    [Property in Key]-?: Type[Property];
  };
}

export {};
