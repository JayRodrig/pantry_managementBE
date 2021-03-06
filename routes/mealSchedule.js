// NPM MODULES
const express = require('express');

// LOCAL MODULES
const MealScheduleServices = require('../services/mealSchedule');
const { authMiddleware, } = require('../services/firebase/authMiddleware');
const IngredientServices = require('../services/ingredient');
const CurrentPantryServices = require('../services/currentPantry');

//ADD SCHEDULED MEAL FOR USER
const createScheduledMeal = (request, response) => {
    const { user_id, recipe_id, day_id, date, cooked, current_week } = request.body;
    MealScheduleServices.createScheduledMeal(user_id, recipe_id, day_id, date, cooked, current_week)
        .then(data => {
            response.status(200).json({
                'msg': `Successfully scheduled meal with ID ${data.id}.`,
                data,
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

//GET ALL SCHEDULED MEALS
const getAllScheduledMeals = (request, response) => {
    MealScheduleServices.getAllScheduledMeals()
        .then(data => {
            response.status(200).json({
                'msg': `Successfully retrieved meal_schedule data.`,
                data,
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
}

//GET ALL SCHEDULED MEALS FOR A SPECIFIC USER
const getScheduledMeals = (request, response) => {
    const { user_id } = request.params;
    MealScheduleServices.getScheduledMeals(user_id)
        .then(data => {
            response.status(200).json({
                'msg': `Successfully retrieved meal_schedule data for user with ID ${user_id}.`,
                data,
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

//GET A SCHEDULED MEAL BY ID 
const getAScheduledMeal = (request, response) => {
    const { id } = request.params;
    MealScheduleServices.getAScheduledMeal(id)
        .then(data => {
            response.status(200).json({
                'msg': `Successfully retrieved meal_schedule data for meal with ID ${id}.`,
                data,
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

//GET SCHEDULED MEALS WHERE CURRENT_WEEK IS TRUE BY USER ID
const getCurrWeekTrueByUserID = (request, response) => {
    const { user_id } = request.params;
    MealScheduleServices.getCurrWeekTrueByUserID(user_id )
        .then(data => {
            response.status(200).json({
                'msg': `Successfully retrieved all current meals true for user ID ${user_id}.`,
                data,
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

//GET SCHEDULED MEALS WHERE CURRENT_WEEK IS TRUE OR FALSE
const getCurrentScheduledMeals = (request, response) => {
    const { status } = request.params;
    MealScheduleServices.getCurrentScheduledMeals(status)
        .then(data => {
            response.status(200).json({
                'msg': `Successfully retrieved all current meals from meal_schedule.`,
                data,
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

//UPDATE A SCHEDULED MEAL CURRENT_WEEK STATUS
const updateCurrentScheduledMeals = (request, response) => {
    const { current_week } = request.body;
    let changeFrom = 'true'; //change from true or false to current week value
    if (current_week === 'true') {
        changeFrom = 'false'
    }
    MealScheduleServices.updateCurrentScheduledMeals(current_week, changeFrom)
        .then(data => {
            response.status(200).json({
                'msg': `Successfully updated all current meals from meal_schedule.`,
                data,
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

//UPDATE A SCHEDULED MEAL CURRENT_WEEK STATUS FROM FALSE TO TRUE BY DATE RANGE
const updateCurrentScheduledMealsToTrue = (request, response) => {
    const { fromDate, toDate } = request.body;
    MealScheduleServices.updateCurrentScheduledMealsToTrue(fromDate, toDate)
        .then(data => {
            response.status(200).json({
                'msg': `Successfully updated all current meals from false to true with dates between ${fromDate} to ${toDate}.`,
                data,
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

//UPDATE SCHEDULED MEAL FOR USER
const updateScheduledMeal = async (request, response) => {
    const { user_id, recipe_id, day_id, date, cooked, current_week } = request.body;
    const { id } = request.params;
    const recipeIngredients = await IngredientServices.getRecipeIngredients(recipe_id);
    const currentPantryProducts = await CurrentPantryServices.getPantryItemsOfUser(user_id);

    let currentPantry = {};

    for (let product of currentPantryProducts) {
        if (!currentPantry[product.product_id]) {
            currentPantry[product.product_id] = product;
        } else {
            continue;
        }
    }

    let usedProducts = [];

    for (let ingredients of recipeIngredients) {
        if (currentPantry[ingredients.product_id]) {
            currentPantry[ingredients.product_id].weight_left =
                currentPantry[ingredients.product_id].weight_left - ingredients.ingredient_gram_weight;
            usedProducts.push(currentPantry[ingredients.product_id]);
        } else {
            continue;
        }
    };

    try {
        const postMealSchedule =
            await MealScheduleServices.updateScheduledMeal(id, user_id, recipe_id, day_id, date, cooked, current_week);
        for (let product of usedProducts) {
            const postUpdatedPantryProd =
                await CurrentPantryServices.updatePantryItemByProductID(product.product_id, product.weight_left);
        };
        response.status(200).json({
            'msg': `Success`,
        });
    } catch (e) {
        response.status(400).json({
            'msg': `Something went wrong`,
            e: e.toString(),
        });
    };
};

//DELETE A SCHEDULED MEAL BY ID
const deleteAScheduledMeal = (request, response) => {
    const { id } = request.params;
    MealScheduleServices.deleteAScheduledMeal(id)
        .then(() => {
            response.status(200).json({
                'msg': `Successfully deleted scheduled meal with ID ${id}.`
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

//DELETE ALL SCHEDULED MEALS FOR USER BY ID
const deleteAllScheduledMealsForUser = (request, response) => {
    const { user_id } = request.params;
    MealScheduleServices.deleteAllScheduledMealsForUser(user_id)
        .then(() => {
            response.status(200).json({
                'msg': `Successfully deleted all scheduled meal  for user with ID ${user_id}.`
            });
        })
        .catch(e => {
            console.log(e)
            response.status(400).json({
                'msg': `Something went wrong.`,
                e,
            });
        });
};

const getMealScheduleRouter = _ => {
    const MealScheduleRouter = express.Router();

    MealScheduleRouter.get('/', getAllScheduledMeals);
    MealScheduleRouter.get('/current/:status', getCurrentScheduledMeals);
    MealScheduleRouter.put('/current', updateCurrentScheduledMeals);
    MealScheduleRouter.put('/current/toTrue', updateCurrentScheduledMealsToTrue);
    // MealScheduleRouter.use(authMiddleware);
    MealScheduleRouter.get('/user/:user_id', getScheduledMeals);
    MealScheduleRouter.get('/currentTrue/:user_id',getCurrWeekTrueByUserID);
    MealScheduleRouter.post('/', createScheduledMeal);
    MealScheduleRouter.get('/:id', getAScheduledMeal);
    MealScheduleRouter.put('/:id', updateScheduledMeal);
    MealScheduleRouter.delete('/:id', deleteAScheduledMeal);
    MealScheduleRouter.delete('/user/:user_id', deleteAllScheduledMealsForUser);

    return MealScheduleRouter;
};

module.exports = {
    getMealScheduleRouter,
};