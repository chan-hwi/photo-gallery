import { useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import type { PostSearchParamsType } from '../types/models';

const useQueryParams = () : PostSearchParamsType => {
    const [searchParams] = useSearchParams();

    return useMemo(() => Object.fromEntries([...searchParams]), [searchParams]);
};

export default useQueryParams;