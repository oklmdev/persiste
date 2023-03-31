import * as React from 'react'

import { ConnectionPage } from './ConnectionPage'

export default { title: 'Page de connexion', component: ConnectionPage }

export const Basique = () => <ConnectionPage />
export const Register = () => <ConnectionPage loginType='register' />
export const AvecErreurEmail = () => <ConnectionPage email='test@test' errors={{ email: 'Email non reconnu.' }} />
export const AvecErreurDeMotDePasse = () => (
  <ConnectionPage email='test@test.com' errors={{ password: 'Mot de passe trop court' }} />
)

export const AvecErreursMultiples = () => (
  <ConnectionPage email='test@test' errors={{ email: 'Email non reconnu.', password: 'Mot de passe trop court' }} />
)
