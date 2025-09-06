import { useCallback, useEffect, useState } from "react";
import { clientsApi } from "@/services/clientsApi";
import { adaptClientsToUI, CustomerUI } from "@/utils/clientAdapter";
import { toast } from "sonner";

export function useClients(initial = { limit: 50, offset: 0 }) {
  const [clients, setClients] = useState<CustomerUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [params, setParams] = useState(initial);

  const fetchClients = useCallback(async (p = params) => {
    try {
      setLoading(true);
      setError(null);
      const resp = await clientsApi.getClients(p);
      setClients(adaptClientsToUI(resp.results));
      setCount(resp.count);
      setNext(resp.next || null);
      setPrevious(resp.previous || null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al cargar clientes";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const refresh = useCallback(async () => {
    await fetchClients(params);
  }, [fetchClients, params]);

  const setPage = useCallback((offset: number, limit = params.limit) => {
    setParams({ limit, offset });
  }, [params.limit]);

  useEffect(() => {
    fetchClients(params);
  }, [fetchClients, params]);

  return { clients, loading, error, count, next, previous, params, setPage, refresh };
}


