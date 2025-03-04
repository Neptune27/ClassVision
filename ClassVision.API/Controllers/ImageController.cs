using ClassVision.API.Extensions;
using ClassVision.API.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace ClassVision.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ImageController : ControllerBase
{
    // POST api/<FileController>
    [HttpPost]
    public async Task<IActionResult> OnPostUploadAsync(IFormFile filepond)
    {
        if (filepond.Length > 0)
        {
            var filePath = Path.GetTempFileName();

            using var stream = System.IO.File.Create(filePath);
                
            await filepond.CopyToAsync(stream);
        }

        List<string> filePaths = [];

        // Process uploaded files
        if (filepond.Length > 0)
        {
            var ext = Path.GetExtension(filepond.FileName);

            var filePath = $"/api/Media/{Guid.CreateVersion7()}{ext}";
            var saveFilePath = Path.Combine($"./wwwroot{filePath}");
            using var stream = System.IO.File.Create(saveFilePath);
            await filepond.CopyToAsync(stream);
            filePaths.Add(filePath);


            return Ok(filePath);
        }


        // Don't rely on or trust the FileName property without validation.

        return BadRequest();
    }

}
