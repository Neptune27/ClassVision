using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class BaseEntity
{
    public DateTimeOffset CreatedAt { get; set; }
    
    public DateTimeOffset LastUpdated { get; set; }
    
    public bool IsActive { get; set; }
}
