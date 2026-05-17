# Deploy AWS CloudFront com GitHub Actions

Este projeto e estatico. O fluxo recomendado e:

1. Arquivos no S3
2. Distribuicao no CloudFront
3. Deploy automatico com GitHub Actions usando OIDC

## 1) Criar infraestrutura na AWS

### S3

1. Crie um bucket para o site (exemplo: judith-kuroe-site-prod).
2. Mantenha Block Public Access ativado.
3. Nao habilite website hosting do S3 para producao com CloudFront.

### CloudFront

1. Crie uma distribuicao CloudFront.
2. Origin: bucket S3.
3. Use OAC (Origin Access Control) para o CloudFront acessar o bucket.
4. Default root object: index.html.
5. Se tiver dominio proprio, associe certificado ACM em us-east-1.

### Bucket policy

Permita leitura apenas para o CloudFront via OAC. Exemplo de policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::SEU_BUCKET/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::SEU_ACCOUNT_ID:distribution/SEU_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

## 2) Criar role OIDC para o GitHub Actions

### Trust policy da role

Substitua ORG, REPO e branch conforme seu repositorio.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::SEU_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:ORG/REPO:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### Permissoes da role

Anexe uma policy com acesso ao bucket e invalidação do CloudFront:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::SEU_BUCKET"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::SEU_BUCKET/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::SEU_ACCOUNT_ID:distribution/SEU_DISTRIBUTION_ID"
    }
  ]
}
```

## 3) Configurar secrets e variables no GitHub

No repositorio, em Settings > Secrets and variables > Actions:

Secrets:

- AWS_ROLE_TO_ASSUME = ARN da role criada para OIDC

Variables:

- AWS_REGION = regiao do bucket S3 (exemplo: sa-east-1)
- S3_BUCKET = nome do bucket
- CLOUDFRONT_DISTRIBUTION_ID = ID da distribuicao

## 4) Workflow do projeto

O arquivo de deploy esta em:

- .github/workflows/deploy-cloudfront.yml

O workflow:

1. Dispara em push na branch main e manualmente
2. Faz upload de assets com cache longo
3. Faz upload de HTML com no-cache
4. Invalida o CloudFront

## 5) Publicar

1. Faça push para a branch main.
2. Acompanhe o job em Actions.
3. Ao finalizar, valide o site na URL do CloudFront.

## 6) Checklist rapido

1. Bucket privado e CloudFront com OAC
2. Role OIDC com trust policy correta
3. Secrets/variables preenchidos
4. Workflow executando sem erro
