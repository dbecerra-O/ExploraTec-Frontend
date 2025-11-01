import { useState, useEffect } from 'react';
import { KPIs, getKPIs } from '../services/admin/kpiServices';

export const useKPIs = () => {
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKPIs = async () => {
            try {
                setLoading(true);
                const kpisData = await getKPIs();
                setKpis(kpisData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error fetching KPIs');
            } finally {
                setLoading(false);
            }
        };

        fetchKPIs();
    }, []);

    const refresh = async () => {
        try {
            setLoading(true);
            setError(null);
            const kpisData = await getKPIs();
            setKpis(kpisData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching KPIs');
        } finally {
            setLoading(false);
        }
    };

    return { kpis, loading, error, refresh };
};