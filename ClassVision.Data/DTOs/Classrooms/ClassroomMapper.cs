using ClassVision.Data.Entities;
using Riok.Mapperly.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Classrooms;

[Mapper]
public partial class ClassroomMapper
{
    public partial ClassroomDto ToDto(Classroom classroom);
    public partial Classroom ToEntity(ClassroomDto classroomDto);

    //public partial ClassroomCreateDto ToEditDto(Classroom classroom);


}
