package com.universidade.sistema_universidade.controller;

import com.universidade.sistema_universidade.dao.MateriaDAO;
import com.universidade.sistema_universidade.model.Materia;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/materias")
@CrossOrigin(origins = "*")
public class MateriaController {

    private final MateriaDAO materiaDAO;

    public MateriaController(MateriaDAO materiaDAO) {
        this.materiaDAO = materiaDAO;
    }

    @PostMapping
    public Materia cadastrarMateria(@RequestBody Materia materia) {

    System.out.println("🔥 CHEGOU NO CONTROLLER");
    System.out.println(materia.getCodigo());
    System.out.println(materia.getNome());

    return materiaDAO.salvar(materia);
    } 
    
    @GetMapping("/codigo/{codigo}")
    public Materia buscarPorCodigo(@PathVariable String codigo) {
        return materiaDAO.buscarPorCodigo(codigo)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Matéria não encontrada"));
    }
    
}