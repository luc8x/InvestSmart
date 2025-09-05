interface Estado {
    sigla: string;
    nome: string;
}

interface Cidade {
    nome: string;
}

const fetchEstados = async (): Promise<Estado[]> => {
    const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
    const data = await res.json();
    return data.sort((a: Estado, b: Estado) => a.nome.localeCompare(b.nome));
};

const fetchCidades = async (estado: string): Promise<Cidade[]> => {
    const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`);
    const data = await res.json();
    return data.map((c: any) => ({ nome: c.nome }));
};