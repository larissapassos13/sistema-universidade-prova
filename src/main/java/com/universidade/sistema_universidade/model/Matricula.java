package com.universidade.sistema_universidade.model;

import jakarta.persistence.*;

@Entity
@Table(name = "matriculas")
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ALUNO
    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    // MATÉRIA
    @ManyToOne
    @JoinColumn(name = "materia_id")
    private Materia materia;

    // TURMA (IMPORTANTE PRA SUA PROVA)
    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;

    private Double nota1;
    private Double nota2;
    private Double nota3;

    public Matricula() {}

    public Long getId() {
        return id;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Materia getMateria() {
        return materia;
    }

    public void setMateria(Materia materia) {
        this.materia = materia;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }

    public Double getNota1() {
        return nota1;
    }

    public void setNota1(Double nota1) {
        this.nota1 = nota1;
    }

    public Double getNota2() {
        return nota2;
    }

    public void setNota2(Double nota2) {
        this.nota2 = nota2;
    }

    public Double getNota3() {
        return nota3;
    }

    public void setNota3(Double nota3) {
        this.nota3 = nota3;
    }

    // =========================
    // MÉDIA
    // =========================
    public Double getMedia() {
        double n1 = nota1 != null ? nota1 : 0;
        double n2 = nota2 != null ? nota2 : 0;
        double n3 = nota3 != null ? nota3 : 0;

        return (n1 + n2 + n3) / 3;
    }

    // =========================
    // APROVAÇÃO (IMPORTANTE PRO TURMA CONTROLLER)
    // =========================
    public boolean isAprovado() {
        return getMedia() >= 6.0;
    }
}