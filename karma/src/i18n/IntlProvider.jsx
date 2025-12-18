import React, { useState } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { DEFAULT_LOCALE, getMessages } from '../nls';

// Context for managing locale state
export const LocaleContext = React.createContext({
    locale: DEFAULT_LOCALE,
    setLocale: () => { },
});

/**
 * IntlProvider wrapper component that provides internationalization
 * context to the entire application
 */
export function IntlProvider({ children }) {
    const [locale, setLocale] = useState(DEFAULT_LOCALE);
    const messages = getMessages(locale);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            <ReactIntlProvider
                locale={locale}
                messages={messages}
                defaultLocale={DEFAULT_LOCALE}
            >
                {children}
            </ReactIntlProvider>
        </LocaleContext.Provider>
    );
}

// Custom hook to use locale context
export function useLocale() {
    const context = React.useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within IntlProvider');
    }
    return context;
}

