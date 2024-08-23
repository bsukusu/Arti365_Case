import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Col, Row, FormGroup, Input, InputGroup, InputGroupText } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() { 
    const [employees, setEmployees] = useState([]);
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    const [createId, setCreateId] = useState(0);
    const [createName, setCreateName] = useState("");
    const [createDepartman, setCreateDepartman] = useState("");
    const [createAge, setCreateAge] = useState(0);
    const [createSalary, setCreateSalary] = useState(0.0);
    const [createGender, setCreateGender] = useState("");

    const [searchTerm, setSearchTerm] = useState('');
    const [allEmployees, setAllEmployees] = useState([]);


    const toggle = useCallback(() => {
        setModal(prev => !prev);
        if (modal) { 
            setCreateId(0);
            setCreateName("");
            setCreateDepartman("");
            setCreateAge(0);
            setCreateSalary(0.0);
            setCreateGender("");
            setIsEditing(false);
            setCurrentEmployee(null);
        }
    }, [modal]);

    const getEmployees = () => {
      fetch("https://localhost:7206/api/employee/", {
          method: 'GET',
          redirect: 'follow'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          setAllEmployees(data);
          if (searchTerm) {
              const filteredData = data.filter(employee =>
                  employee.name.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setEmployees(filteredData);
          } else {
              setEmployees(data);
          }
      })
      .catch(error => {
          console.error('Fetch error:', error.message);
      });
  }
  
    const createOrUpdateEmployee = async () => {
        const data = {
            id: parseInt(createId, 10),
            name: createName,
            departman: createDepartman,
            gender: createGender,
            age: createAge,
            salary: createSalary
        };

        try {
            const url = isEditing ? `https://localhost:7206/api/employee/${createId}` : "https://localhost:7206/api/employee";
            const method = isEditing ? "PUT" : "POST";
            const result = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseText = await result.text();
            
            if (result.ok) {
                toast.success(isEditing ? "Çalışan güncellendi." : "Çalışan eklendi.", { position: "top-center" });
                getEmployees();
                toggle();
            } else {
                toast.error("Kaydedilemedi.", { position: "top-center" });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error("Kaydedilemedi.", { position: "top-center" });
        }
    }

    const deleteEmp = async(id) => {
        const isConfirmed = window.confirm("Bu çalışanı silmek istediğinizden emin misiniz?");
        if (!isConfirmed) return;
        
        try {
            const response = await fetch(`https://localhost:7206/api/employee/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success("Çalışan silindi.", { position: "top-center"});
                getEmployees();
            } else {
                toast.error("Çalışan silinemedi.", { position: "top-center" });
            }
        } catch (error) {
            console.error('Hata oluştu:', error);
        }
    };
    
    const editEmp = (employee) => {
        setCreateId(employee.id);
        setCreateName(employee.name);
        setCreateDepartman(employee.departman);
        setCreateAge(employee.age);
        setCreateSalary(employee.salary);
        setCreateGender(employee.gender);
        setIsEditing(true);
        setCurrentEmployee(employee);
        toggle();
    };

    useEffect(() => {
        getEmployees();  
    }, []);

    return (
        <div className="container">
            <ToastContainer/>
            <Modal isOpen={modal} toggle={toggle} style={{ maxWidth: '800px'}}>
                <ModalHeader toggle={toggle}>{isEditing ? "Çalışanı Düzenle" : "Yeni Çalışan Ekle"}</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroupText>
                                            Id
                                        </InputGroupText>
                                        <Input value={createId} onChange={e => setCreateId(e.target.value)} disabled={isEditing} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroupText>
                                            Çalışan İsim Soyisim
                                        </InputGroupText>
                                        <Input value={createName} onChange={e => setCreateName(e.target.value)} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupText>
                                    Departman
                                </InputGroupText>
                                <Input value={createDepartman} onChange={e => setCreateDepartman(e.target.value)} />
                            </InputGroup>
                        </FormGroup>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroupText>
                                            Cinsiyet
                                        </InputGroupText>
                                        <Input value={createGender} onChange={e => setCreateGender(e.target.value)} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroupText>
                                            Yaş
                                        </InputGroupText>
                                        <Input value={createAge} onChange={e => setCreateAge(e.target.value)} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupText>
                                    Maaş
                                </InputGroupText>
                                <Input value={createSalary} onChange={e => setCreateSalary(e.target.value)} />
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>İptal</Button>
                    <Button color="primary" onClick={createOrUpdateEmployee}>{isEditing ? "Güncelle" : "Kaydet"}</Button>
                </ModalFooter>
            </Modal>
            <h1 className="text-center fst-italic text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3 mt-5 py-3">Çalışan Listesi</h1>
            <Row>
              <Col>
               <Button className='text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3 my-3' onClick={toggle}>
                    Çalışan ekle
                </Button>
              </Col>
              <Col className='d-flex justify-content-end my-3'>
                <Input
                    style={{ width: '300px', textAlign:'center' }}
                    placeholder='Çalışan Ara'
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        if (e.target.value === '') {
                            setEmployees(allEmployees); 
                        } else {
                            getEmployees(); 
                        } }}/>
</Col>


            </Row>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Çalışan Id</th>
                        <th>İsim</th>
                        <th>Departman</th> 
                        <th>Cinsiyet</th> 
                        <th>Yaş</th>
                        <th>Maaş</th>
                        <th>Operasyonlar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        employees.map(employee =>
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.departman}</td>
                                <td>{employee.gender}</td>
                                <td>{employee.age}</td>
                                <td>{employee.salary}</td>
                                <td>
                                    <Button color="light" className="mr-1" onClick={() => editEmp(employee)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg> 
                                    </Button>
                                    <Button color="light" className="mr-1" onClick={() => deleteEmp(employee.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                        </svg>
                                    </Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <h6 className="p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3">Güncel çalışan sayısı: {employees.length}</h6>
        </div>
    );
}

export default App;
