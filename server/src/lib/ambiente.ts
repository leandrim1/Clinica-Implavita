import { config } from 'dotenv';
import { z } from 'zod';

config();

const booleano = z
  .string()
  .optional()
  .transform((v) => v === 'true' || v === '1');

const esquema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória.'),
  DATABASE_SSL: booleano,
  PORT: z.coerce.number().int().positive().default(3333),
  AMBIENTE: z.enum(['development', 'production', 'test']).default('development'),
  ORIGENS_PERMITIDAS: z
    .string()
    .default('http://localhost:5173')
    .transform((v) => v.split(',').map((o) => o.trim()).filter(Boolean)),
  SEGREDO_SESSAO: z.string().min(16, 'SEGREDO_SESSAO precisa de pelo menos 16 caracteres.'),
  SESSAO_HORAS: z.coerce.number().int().positive().max(720).default(12),
  ADMIN_EMAIL: z.string().email().optional().or(z.literal('')),
  ADMIN_SENHA: z.string().optional(),
  ADMIN_NOME: z.string().default('Administrador'),
  ARMAZENAMENTO: z.enum(['local', 'blob']).default('local'),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_PLACE_ID: z.string().optional(),
});

const resultado = esquema.safeParse(process.env);

if (!resultado.success) {
  const problemas = resultado.error.issues
    .map((p) => `  - ${p.path.join('.')}: ${p.message}`)
    .join('\n');
  console.error(`Configuração inválida no .env:\n${problemas}`);
  process.exit(1);
}

export const ambiente = resultado.data;
export const emProducao = ambiente.AMBIENTE === 'production';
