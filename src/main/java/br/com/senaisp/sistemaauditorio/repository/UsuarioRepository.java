package br.com.senaisp.sistemaauditorio.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import br.com.senaisp.sistemaauditorio.model.Usuario;


@Repository
public interface UsuarioRepository extends PagingAndSortingRepository<Usuario, Long>{

}
