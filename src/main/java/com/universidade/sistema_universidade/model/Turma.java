package com.universidade.sistema_universidade.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "turmas")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codigo;

    // RELACIONAMENTO CORRETO COM MATRÍCULA
    @OneToMany(mappedBy = "turma", fetch = FetchType.EAGER)
    private List<Matricula> matriculas;

    public Turma() {}

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public List<Matricula> getMatriculas() {
        return matriculas;
    }

    public void setMatriculas(List<Matricula> matriculas) {
        this.matriculas = matriculas;
    }
}