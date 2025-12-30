import { AnalyticVariable, useAnalyticStore } from "../model/useAnalyticStore";
import { Checkbox, Collapse, FormControlLabel, Typography } from "@mui/material";

import { useLayers } from "@/entites/layer/model/useLayers";
import { useVariableCollapse } from "../model/useVariableCollapse";

function VariableSelector() {

    const { open } = useVariableCollapse();
    const { layers } = useLayers();
    const { disabledVariables, toggleVariable, groupedVariables } = useAnalyticStore();

    return (
        <Collapse in={open} unmountOnExit className="mt-4 flex-shrink-0">
            {Object.entries(groupedVariables).map(([category, vars]) => {
                const sitesGrouped = vars.reduce((acc, v) => {
                    const siteName =
                        layers
                            .find(l => l.category.id === v.categoryId)
                            ?.sites.find(s => s.id === v.siteId)?.name || "Без сайта";
                    if (!acc[siteName]) acc[siteName] = [];
                    acc[siteName].push(v);
                    return acc;
                }, {} as Record<string, AnalyticVariable[]>);

                return (
                    <div key={category} style={{ marginBottom: "16px" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {category}
                        </Typography>

                        {Object.entries(sitesGrouped).map(([siteName, siteVars]) => (
                            <div key={siteName} style={{ marginBottom: "12px", paddingLeft: "12px" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {siteName}
                                </Typography>
                                <div className="w-full flex flex-wrap">
                                    {siteVars.map(v => (
                                        <FormControlLabel
                                            key={`${v.categoryId}-${v.siteId}-${v.id}`}
                                            control={
                                                <Checkbox
                                                    checked={!(disabledVariables[v.siteId]?.includes(v.id))}
                                                    onChange={() => toggleVariable(v.siteId, v.id)}
                                                />
                                            }
                                            label={v.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </Collapse>
    );
}

export default VariableSelector;