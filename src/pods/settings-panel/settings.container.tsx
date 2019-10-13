import * as React from "react";
import { SettingsComponent } from "./settings.component";
import { SessionContext } from "core";

export const SettingsContainer = () => {
    const sessionContext = React.useContext(SessionContext);
    const [refreshTimeout] = React.useState(sessionContext.refreshTimeout);

    const handleRefreshTimeoutChange = (newValue:number) => {
        sessionContext.updateRefreshTimeout(newValue);
    };

    return (
        <SettingsComponent refreshTimeout={refreshTimeout} updateRefreshTimeout={handleRefreshTimeoutChange}/>
    )

}