declare module "json-bigint" {
    const JSONBig: {
      parse: (text: string) => any;
      stringify: (value: any) => string;
    };
    export default JSONBig;
  }