import logger from "redux-logger";

export default configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
