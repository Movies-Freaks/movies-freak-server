import CreateWatchHub from './create';
import GetWatchHubById from './getById';
import GetWatchHubList from './getList';

const WatchHubs = {
  Create: CreateWatchHub,
  GetById: GetWatchHubById,
  GetList: GetWatchHubList
};

export default WatchHubs;
