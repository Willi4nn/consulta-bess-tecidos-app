/**
 * Constantes globais da aplicação
 */

// LocalStorage
export const STORAGE_KEY = 'bessFabrics';

// Tipos de arquivo aceitos
export const EXCEL_ACCEPT = '.xlsx,.xls';

// Mensagens de erro
export const ERROR_MESSAGES = {
  STORAGE_READ: 'Erro ao ler dados do localStorage',
  EXCEL_PARSE: 'Erro ao processar Excel',
  INVALID_FORMAT: 'Formato inválido',
  NETWORK_ERROR: 'Não foi possível carregar a tabela',
};

// Configurações
export const CONFIG = {
  DEFAULT_SHEET_INDEX: 1,
  FALLBACK_SHEET_INDEX: 0,
};
