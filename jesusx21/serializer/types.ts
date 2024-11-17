export enum OptionAs {
  ARRAY,
  JSON,
  NUMBER,
}

export type Json = {
  [key: string]: any
};

type Formatter = {
  deserialize: (field: Json) => any,
  serialize: (field: any) => Json
};

type Serializer = {
  fromJson: (data: Json) => any,
  toJson: (entity: any) => Json
};

export type FieldOptions = {
  as?: OptionAs,
  from?: string,
  using?: Serializer,
  when?: Json,
  withFormatter?: Formatter,
};

export type EachFieldCallback = (field: string, options: FieldOptions) => void;

export type Class = { new(...args: any[]): any; };
