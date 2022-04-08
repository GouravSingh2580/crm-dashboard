import { Loading } from '../components/common';

const useLoading = (flag: boolean = false) => (flag ? <Loading /> : null);

export default useLoading;
