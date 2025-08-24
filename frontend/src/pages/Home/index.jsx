import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../assets/lixeira-botao.png'
import api from '../../services/api'

function Home() {
  const [users, setUsers] = useState([])

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    try {
      const usersFromApi = await api.get('/usuarios')
      setUsers(usersFromApi.data)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  async function createUsers() {
    const name = inputName.current.value.trim()
    const email = inputEmail.current.value.trim()
    const age = Number(inputAge.current.value)

    // 🔒 Validação dos campos
    if (!name || !email || isNaN(age) || age <= 0) {
      alert('Preencha todos os campos corretamente.')
      return
    }

    try {
      await api.post('/usuarios', {
        name,
        age,
        email,
      })

      // Limpa os campos após envio
      inputName.current.value = ''
      inputAge.current.value = ''
      inputEmail.current.value = ''

      // Atualiza a lista de usuários
      getUsers()
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      alert(error.response?.data?.error || 'Erro ao cadastrar usuário.')
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuários</h1>
        <input placeholder='Nome' name='nome' type='text' ref={inputName} />
        <input placeholder='Idade' name='idade' type='number' ref={inputAge} />
        <input placeholder='E-mail' name='email' type='email' ref={inputEmail} />
        <button type='button' onClick={createUsers}>Cadastrar</button>
      </form>

      {users.map((user, index) => (
        <div key={index} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>

          <div>
            <button>
              <img src={Trash} alt="Excluir" style={{ width: '50px' }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
