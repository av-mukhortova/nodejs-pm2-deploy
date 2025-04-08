import { model, Schema } from 'mongoose';

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return /^(https?:\/\/)(www\.)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/gm.test(v);
      },
      message: (props) => `${props.value} - некорректная ссылка`,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [{
      type: Schema.Types.ObjectId,
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export default model<ICard>('card', cardSchema);
