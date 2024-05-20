import Questions from '../models/Questions.js';
import mongoose from 'mongoose';

export const askQuestion = async (req, res) => {
    const postQuestionData = req.body;
    const userId = req.userId;
    const postQuestion = new Questions({ ...postQuestionData, userId });

    try {
        await postQuestion.save();
        res.status(201).json({ message: "Question posted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Couldn't post a new question" });
    }
};

export const getAllQuestions = async (req, res) => {
    try {
        const questionList = await Questions.find();
        res.status(200).json(questionList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve questions" });
    }
};

export const deleteQuestion = async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ message: 'Question not found' });
    }

    try {
        await Questions.findByIdAndRemove(_id);
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete question" });
    }
};

export const voteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ message: 'Question not found' });
    }

    try {
        const question = await Questions.findById(_id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const upIndex = question.upVote.indexOf(String(userId));
        const downIndex = question.downVote.indexOf(String(userId));

        if (value === 'upVote') {
            if (downIndex !== -1) {
                question.downVote.splice(downIndex, 1);
            }
            if (upIndex === -1) {
                question.upVote.push(userId);
            } else {
                question.upVote.splice(upIndex, 1);
            }
        } else if (value === 'downVote') {
            if (upIndex !== -1) {
                question.upVote.splice(upIndex, 1);
            }
            if (downIndex === -1) {
                question.downVote.push(userId);
            } else {
                question.downVote.splice(downIndex, 1);
            }
        }

        await question.save();
        res.status(200).json({ message: "Vote recorded successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to record vote" });
    }
};
