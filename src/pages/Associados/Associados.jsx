import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Associados() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [quantidadePg, setQuantidadePg] = useState(0);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [showVisModal, setShowVisModal] = useState(false);
  const [showCadModal, setShowCadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nomeEdit, setNomeEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [idToDelete, setIdToDelete] = useState(null);
  const [msgAlerta, setMsgAlerta] = useState('');
  const [msgAlertaErroCad, setMsgAlertaErroCad] = useState('');
  const [msgAlertaErroEdit, setMsgAlertaErroEdit] = useState('');
  const [msgAlertaErroDelete, setMsgAlertaErroDelete] = useState('');

  const showAlert = (setMsgFunction, message) => {
    setMsgFunction(message);
    setTimeout(() => {
      setMsgFunction('');
    }, 3000); 
  };

  const getAssociados = async (pagina) => {
    setCarregando(true);
    try {
      const response = await fetch(`http://localhost/associados/list.php?pagina=${pagina}`);
      const responseJson = await response.json();
      if (response.ok) {
        setData(responseJson.associados || []);
        setFilteredData(responseJson.associados || []);
        setQuantidadePg(responseJson.quantidade_pg || 0);
        setPaginaAtual(pagina);
        setErro(null);
      } else {
        throw new Error(responseJson.mensagem || "Erro ao carregar dados.");
      }
    } catch (error) {
      setErro(error.message);
      setData([]);
      setFilteredData([]); 
    } finally {
      setCarregando(false);
    }
  };

  const visAssociado = async (id) => {
    try {
      const response = await fetch(`http://localhost/associados/visualizar.php?id=${id}`);
      const responseJson = await response.json();
      if (response.ok && !responseJson.erro) {
        setModalData(responseJson.dados);
        setShowVisModal(true);
      } else {
        setErro(responseJson.msg || "Erro ao visualizar associado.");
      }
    } catch (error) {
      setErro(error.message);
    }
  };

  const cadastrarAssociado = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      showAlert(setMsgAlertaErroCad, "Erro: Necessário preencher o campo nome!");
      return;
    }

    if (!email.trim()) {
      showAlert(setMsgAlertaErroCad, "Erro: Necessário preencher o campo e-mail!");
      return;
    }

    const dadosForm = {
      nome: nome,
      email: email
    };

    try {
      const response = await fetch("http://localhost/associados/cadastrar.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosForm)
      });
      const resposta = await response.json();
      if (resposta['erro']) {
        showAlert(setMsgAlertaErroCad, resposta['msg']);
      } else {
        showAlert(setMsgAlerta, resposta['msg']);
        setNome('');
        setEmail('');
        setShowCadModal(false);
        getAssociados(paginaAtual);
      }
    } catch (error) {
      showAlert(setMsgAlertaErroCad, "Erro ao cadastrar associado.");
    }
  };

  const editarAssociado = async (dados) => {
    try {
      const response = await fetch("http://localhost/associados/editar.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });
      const resposta = await response.json();
      if (resposta.erro) {
        showAlert(setMsgAlertaErroEdit, resposta.msg);
      } else {
        showAlert(setMsgAlerta, resposta.msg);
        setShowEditModal(false);
        getAssociados(paginaAtual);
      }
    } catch (error) {
      showAlert(setMsgAlertaErroEdit, "Erro ao editar associado.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const dados = {
      id: modalData.id,
      nome: nomeEdit,
      email: emailEdit
    };

    await editarAssociado(dados);
  };

  const deletarAssociado = async () => {
    if (idToDelete) {
      try {
        const response = await fetch(`http://localhost/associados/apagar.php?id=${idToDelete}`, {
          method: "GET",
        });
        const resposta = await response.json();
        if (resposta.erro) {
          showAlert(setMsgAlertaErroDelete, resposta.msg);
        } else {
          showAlert(setMsgAlerta, resposta.msg);
          setShowDeleteConfirm(false);
          getAssociados(paginaAtual);
        }
      } catch (error) {
        showAlert(setMsgAlertaErroDelete, "Erro ao apagar associado.");
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = data.filter(associado =>
      associado.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
      associado.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleChangePage = (pagina) => {
    setPaginaAtual(pagina);
  };

  const renderPagination = () => {
    const maxLinks = 2;
    let pagination = [];

    if (paginaAtual > 1) {
      pagination.push(
        <li className="page-item" key="first">
          <a className="page-link" href="#" onClick={() => handleChangePage(1)}>Primeira</a>
        </li>
      );
    }

    for (let i = Math.max(1, paginaAtual - maxLinks); i < paginaAtual; i++) {
      pagination.push(
        <li className="page-item" key={i}>
          <a className="page-link" href="#" onClick={() => handleChangePage(i)}>{i}</a>
        </li>
      );
    }

    pagination.push(
      <li className="page-item active" key={paginaAtual}>
        <a className="page-link" href="#">{paginaAtual}</a>
      </li>
    );

    for (let i = paginaAtual + 1; i <= Math.min(paginaAtual + maxLinks, quantidadePg); i++) {
      pagination.push(
        <li className="page-item" key={i}>
          <a className="page-link" href="#" onClick={() => handleChangePage(i)}>{i}</a>
        </li>
      );
    }

    if (paginaAtual < quantidadePg) {
      pagination.push(
        <li className="page-item" key="last">
          <a className="page-link" href="#" onClick={() => handleChangePage(quantidadePg)}>Última</a>
        </li>
      );
    }

    return pagination;
  };

  useEffect(() => {
    getAssociados(paginaAtual);
  }, [paginaAtual]);

  return (
    <div>
      <Header title="Lista de Associados" />
      <div className="container">
        <div className="row mt-4">
          <div className="col-lg-12 d-flex justify-content-between align-items-center">
            <div className="col-lg-12 d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder= "Pesquisar"
                value={searchTerm}
                onChange={handleSearch}
              />
              
              
              <button type="button" className="btn btn-primary btn-sm me-2" onClick={() => setShowCadModal(true)}>
                <i className="fa-solid fa-plus"></i> Cadastrar
              </button>
            </div>
          </div>
        </div>
        <hr />
        {msgAlerta && <div className="alert alert-success" role="alert">{msgAlerta}</div>}
        {msgAlertaErroCad && <div className="alert alert-danger" role="alert">{msgAlertaErroCad}</div>}
        {msgAlertaErroEdit && <div className="alert alert-danger" role="alert">{msgAlertaErroEdit}</div>}
        {msgAlertaErroDelete && <div className="alert alert-danger" role="alert">{msgAlertaErroDelete}</div>}
        {carregando && <div>Carregando...</div>}
        {erro && <div className="alert alert-danger" role="alert">{erro}</div>}
        {!carregando && !erro && (
           <table class='table table-striped table-bordered'>
            <thead>
              <tr>
                {/*<th>ID</th> */}

                <th>Nome</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((associado) => (
                <tr key={associado.id}>
                 {/* <td>{associado.id}</td>*/}
                  <td>{associado.nome}</td>
                  <td>{associado.email}</td>
                  <td>
                    <button
                      className="btn btn-outline-info btn-sm me-2"
                      onClick={() => visAssociado(associado.id)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm me-2"
                      onClick={() => {
                        setNomeEdit(associado.nome);
                        setEmailEdit(associado.email);
                        setModalData(associado);
                        setShowEditModal(true);
                      }}
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        setIdToDelete(associado.id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <nav aria-label="Page navigation">
          <ul className="pagination">
            {renderPagination()}
          </ul>
        </nav>
      </div>

      {/* Modal Cadastro */}
      <Modal show={showCadModal} onHide={() => setShowCadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Associado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={cadastrarAssociado}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button variant="primary" type="submit">Cadastrar</Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal Editar */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Associado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label htmlFor="nomeEdit" className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nomeEdit"
                value={nomeEdit}
                onChange={(e) => setNomeEdit(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="emailEdit" className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                id="emailEdit"
                value={emailEdit}
                onChange={(e) => setEmailEdit(e.target.value)}
              />
            </div>
            <Button variant="primary" type="submit">Salvar Alterações</Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal Visualizar */}
      <Modal show={showVisModal} onHide={() => setShowVisModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Associado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <div>
              <p><strong>ID:</strong> {modalData.id}</p>
              <p><strong>Nome:</strong> {modalData.nome}</p>
              <p><strong>E-mail:</strong> {modalData.email}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Confirmação de Exclusão */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza de que deseja excluir este associado?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
          <Button variant="danger" onClick={deletarAssociado}>Excluir</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Associados;
