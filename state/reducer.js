import * as entities from './entities';
import { app, collaboratorRanking } from './app';
import { manageMonthBonus } from './app/manageMonthBonus.model';

const reducer = () => ({
  redux: {},
  models: {
    ...entities,
    app,
    manageMonthBonus,
    collaboratorRanking
  },
});

export default reducer;
