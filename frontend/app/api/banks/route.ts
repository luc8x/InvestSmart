import { NextRequest, NextResponse } from 'next/server'


const bancosBrasileiros = [
  { codigo: '001', nome: 'Banco do Brasil S.A.' },
  { codigo: '033', nome: 'Banco Santander (Brasil) S.A.' },
  { codigo: '104', nome: 'Caixa Econômica Federal' },
  { codigo: '237', nome: 'Banco Bradesco S.A.' },
  { codigo: '341', nome: 'Itaú Unibanco S.A.' },
  { codigo: '260', nome: 'Nu Pagamentos S.A. (Nubank)' },
  { codigo: '077', nome: 'Banco Inter S.A.' },
  { codigo: '212', nome: 'Banco Original S.A.' },
  { codigo: '290', nome: 'PagSeguro Digital Ltd.' },
  { codigo: '323', nome: 'Mercado Pago' },
  { codigo: '336', nome: 'Banco C6 S.A.' },
  { codigo: '655', nome: 'Banco Votorantim S.A.' },
  { codigo: '041', nome: 'Banco do Estado do Rio Grande do Sul S.A.' },
  { codigo: '070', nome: 'BRB - Banco de Brasília S.A.' },
  { codigo: '085', nome: 'Cooperativa Central de Crédito Urbano - CECRED' },
  { codigo: '136', nome: 'Unicred Cooperativa' },
  { codigo: '208', nome: 'Banco BTG Pactual S.A.' },
  { codigo: '218', nome: 'Banco BS2 S.A.' },
  { codigo: '224', nome: 'Banco Fibra S.A.' },
  { codigo: '246', nome: 'Banco ABC Brasil S.A.' },
  { codigo: '389', nome: 'Banco Mercantil do Brasil S.A.' },
  { codigo: '422', nome: 'Banco Safra S.A.' },
  { codigo: '633', nome: 'Banco Rendimento S.A.' },
  { codigo: '652', nome: 'Itaú Unibanco Holding S.A.' },
  { codigo: '745', nome: 'Banco Citibank S.A.' }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    
    let bancosFiltrados = bancosBrasileiros
    
    if (search) {
      bancosFiltrados = bancosBrasileiros.filter(banco => 
        banco.nome.toLowerCase().includes(search) ||
        banco.codigo.includes(search)
      )
    }
    
    const bancosLimitados = bancosFiltrados.slice(0, 10)
    
    return NextResponse.json({
      success: true,
      data: bancosLimitados,
      total: bancosFiltrados.length
    })
    
  } catch (error) {
    console.error('Erro ao buscar bancos:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}