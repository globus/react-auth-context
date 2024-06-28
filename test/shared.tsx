import React from 'react';
import { Provider, Props } from '../src/Provider';

export const createWrapper =
    (opts: Props) =>
        ({ children }: React.PropsWithChildren): JSX.Element => {
            const provider = <Provider {...opts}>{children}</Provider>;
            return <React.StrictMode>{provider}</React.StrictMode>;
        };