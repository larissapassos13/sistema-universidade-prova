package com.universidade.sistema_universidade.dao;

import com.universidade.sistema_universidade.model.Turma;
import com.universidade.sistema_universidade.repository.TurmaRepository;

import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TurmaDAO {

    private final TurmaRepository turmaRepository;

    public TurmaDAO(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }

    // SALVAR TURMA
    public Turma salvar(Turma turma) {
        return turmaRepository.save(turma);
    }

    // BUSCAR POR CÓDIGO
    public Optional<Turma> buscarPorCodigo(String codigo) {
        return turmaRepository.findByCodigo(codigo);
    }
}