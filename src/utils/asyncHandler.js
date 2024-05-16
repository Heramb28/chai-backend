const asyncHandler = (requestHandler) =>  {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=> next(err))
    }
}




export {asyncHandler}


// const asyncHandler = ()=>{}
// const asyncHandler = (func)=> async ()=>{}
// const asyncHandler = (fn) => {() => {}}

// const asyncHandler = (fn) => async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }
// This code is defining a higher-order function named `asyncHandler`, which takes another function called `requestHandler` as its parameter.
//Let's break down what each part of the code does:

// 1. `const asyncHandler = (requestHandler) => { ... }`: This line defines a function named `asyncHandler` using arrow function syntax.
//It takes one parameter named `requestHandler`.

// 2. `return (req, res, next) => { ... }`: This line returns another function that takes three parameters: `req` (the request object), `res` (the response object),
//and `next` (a callback function to pass control to the next middleware). This is an example of middleware function signature commonly used in Express.js.

// 3. `Promise.resolve(requestHandler(req, res, next))`: Inside the returned function, this line calls the `requestHandler` function
//with the provided `req`, `res`, and `next` parameters. It wraps the result in a Promise using `Promise.resolve()`. 
//This is done to ensure that whatever is returned by `requestHandler` is always treated as a Promise.

// 4. `.catch((err) => next(err))`: This line adds a `.catch()` block to handle any errors that might occur during the execution of `requestHandler`. 
//If an error occurs, it calls the `next` function with the `err` parameter, which passes the error to the next middleware in the Express.js middleware chain.

// Overall, this `asyncHandler` function is used to wrap other asynchronous route handlers (such as those used in Express.js) to ensure that
//any errors thrown within them are properly caught and passed on to the Express error handling middleware. 
//This helps in writing cleaner and more maintainable code by centralizing error handling logic.