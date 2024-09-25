import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ;

const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
});

export const generatePlan = async (type, userInfo) => {
    const dietPlanStructure = `
        1. Brief introduction (2-3 sentences)
        2. Daily Meal Plan:
        ## Detailed Daily Meal Plan
        | Meal | Time | Foods | Portion Size | Calories | Protein | Carbs | Fats |
        |------|------|-------|--------------|----------|---------|-------|------|
        | Breakfast | 7:00 AM |  |  |  |  |  |  |
        | Snack | 10:00 AM |  |  |  |  |  |  |
        | Lunch | 1:00 PM |  |  |  |  |  |  |
        | Snack | 4:00 PM |  |  |  |  |  |  |
        | Dinner | 7:00 PM |  |  |  |  |  |  |
        3. Weekly Overview:
        ## Weekly Calorie and Macronutrient Targets
        | Day | Total Calories | Protein (g) | Carbs (g) | Fats (g) |
        |-----|----------------|-------------|-----------|----------|
        | Monday |  |  |  |  |
        | Tuesday |  |  |  |  |
        | Wednesday |  |  |  |  |
        | Thursday |  |  |  |  |
        | Friday |  |  |  |  |
        | Saturday |  |  |  |  |
        | Sunday |  |  |  |  |
        4. Grocery List:
        ## Weekly Grocery List
        | Category | Items |
        |----------|-------|
        | Proteins |  |
        | Vegetables |  |
        | Fruits |  |
        | Grains |  |
        | Dairy |  |
        | Other |  |
        5. 3-5 tips for diet success (bullet points)`;

    const exercisePlanStructure = `
        1. Brief introduction (2-3 sentences)
        2. Weekly Workout Schedule:
        ## Detailed Weekly Workout Plan
        | Day | Time | Workout Type | Exercises | Sets x Reps | Rest | Intensity |
        |-----|------|--------------|-----------|-------------|------|-----------|
        | Monday | 6:00 AM |  |  |  |  |  |
        | Tuesday | 6:00 AM |  |  |  |  |  |
        | Wednesday | 6:00 AM |  |  |  |  |  |
        | Thursday | 6:00 AM |  |  |  |  |  |
        | Friday | 6:00 AM |  |  |  |  |  |
        | Saturday | 6:00 AM |  |  |  |  |  |
        | Sunday | Rest Day |  |  |  |  |  |
        3. Exercise Descriptions:
        ## Key Exercise Descriptions
        | Exercise | Muscle Group | Description | Form Tips |
        |----------|--------------|-------------|-----------|
        |  |  |  |  |
        |  |  |  |  |
        |  |  |  |  |
        4. Progress Tracking:
        ## Weekly Progress Tracker
        | Metric | Week 1 | Week 2 | Week 3 | Week 4 |
        |--------|--------|--------|--------|--------|
        | Weight (kg) |  |  |  |  |
        | Body Fat % |  |  |  |  |
        | Chest (cm) |  |  |  |  |
        | Waist (cm) |  |  |  |  |
        | Arms (cm) |  |  |  |  |
        | Thighs (cm) |  |  |  |  |
        5. 3-5 tips for exercise success (bullet points)`;

    const planStructure = type === 'diet' ? dietPlanStructure : exercisePlanStructure;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a fitness trainer creating a detailed ${type} plan. Use the following structure for your response:
                    ${planStructure}
                    Fill in all tables with appropriate, detailed information based on the user's profile. Keep descriptions in table cells brief but informative.`,
                },
                {
                    role: "user",
                    content: `Create a detailed ${type} plan for: name=${userInfo.name}, age=${userInfo.age}, height=${userInfo.height}, weight=${userInfo.weight}, gender=${userInfo.gender}, diet type=${userInfo.dietType}, and goal=${userInfo.goal}.`,
                },
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.2,
            max_tokens: 2048,
            top_p: 1,
            stream: true,
            stop: null,
        });

        let response = "";
        for await (const chunk of chatCompletion) {
            response += chunk.choices[0]?.delta?.content || "";
        }

        return response;
    } catch (error) {
        throw new Error("Error! Cannot process request");
    }
};