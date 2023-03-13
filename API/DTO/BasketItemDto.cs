namespace API.DTO
{
    public class BasketItemDto
    {
        public int Productid { get; set; }
        public string Name { get; set; }
        public long Price { get; set; } 
        public string PictureUrl { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public int Quantity { get; set; }
    }
}