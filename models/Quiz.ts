import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
    set: function (v: string | Date) {
      return new Date(v);
    },
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 0,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          text: {
            type: String,
            required: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
          },
        },
      ],
      marks: {
        type: Number,
        required: true,
        default: 1,
      },
      timeLimit: {
        type: Number,
        required: true,
        default: 5,
      },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

// Add a toJSON transform to ensure all fields are included
QuizSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Ensure dueDate is properly formatted
    if (ret.dueDate) {
      ret.dueDate = ret.dueDate.toISOString();
    }

    // Ensure questions have proper number types
    if (ret.questions) {
      ret.questions = ret.questions.map(
        (q: { marks: number; timeLimit: number }) => ({
          ...q,
          marks: Number(q.marks),
          timeLimit: Number(q.timeLimit),
        })
      );
    }

    // Ensure totalMarks is a number
    if (ret.totalMarks) {
      ret.totalMarks = Number(ret.totalMarks);
    }

    return ret;
  },
});

// Add a pre-save middleware to ensure proper date handling
QuizSchema.pre("save", function (next) {
  if (this.dueDate) {
    this.dueDate = new Date(this.dueDate);
  }
  next();
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

export default Quiz;
