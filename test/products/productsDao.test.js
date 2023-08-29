import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Integrador ", () => {
  describe("Test de Users", () => {
    let cookie;
    it("El endpoint POST /api/sessions/register debe registrar correctamente a un usuario", async function () {
      const mockUser = {
        first_name: "mockUserchichito",
        last_name: "mockLastnamearduino",
        email: "chichitomock@mockUser.com",
        password: "123",
        age: "20",
      };
      const { status } = await requester
        .post("/api/sessions/register")
        .send(mockUser);
      expect(status).to.be.eql(200);
    });

    it("El endpoint POST /api/sessions/login debe creaer una cookie", async function () {
      const mockUser = {
        email: "aprt@correo.com",
        password: "123",
      };
      const response = await requester
        .post("/api/sessions/login")
        .send(mockUser);
      const cookieResult = response.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.eql("authToken");
      expect(cookie.value).to.be.ok;
    });

    it("El endpoint post GET /api/sessions/current debe traer un usuario", async function () {
      const response = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      const responseBody = response._body;
      console.log(responseBody);
      expect(responseBody).to.have.property("message");
    });

    it("El endpoint post POST /api/sessions/logout no debera traer una cookie", async function () {
      const mockUser = {
        email: "aprt@correo.com",
        password: "123",
      };

      const response = await requester
        .post("/api/sessions/logout")
        .send(mockUser);
      const setCookieHeader = response.headers["set-cookie"];
      const expectedClearedCookie =
        "authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
      expect(setCookieHeader).to.deep.equal([expectedClearedCookie]);
    });
  });

  describe("Test de Productos", () => {
    let cookie;
    let responseBodyRole; // Declare responseBodyRole

    before(async () => {
      const mockUser = {
        email: "aprt@correo.com",
        password: "123",
      };
      const responseUser = await requester
        .post("/api/sessions/login")
        .send(mockUser);
      const cookieResult = responseUser.headers["set-cookie"][0];

      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };

      const response = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      const responseBody = response.body;
      responseBodyRole = responseBody.message.role;
      console.log("antes", responseBodyRole);
    });

    it("Endpoint POST /api/products debera crear correctamente un producto cuando estoy logeado como USERPREMIUM o ADMIN", async function () {
      const mockProduct = {
        title: "pruebaita ",
        description: "desde testing   ",
        code: "prue",
        price: 10,
        status: "Active",
        stock: 2,
        category: "watches",
      };
      console.log("enelrol", responseBodyRole);
      if (responseBodyRole === "PREMIUM" || responseBodyRole === "ADMIN") {
        const response = await requester
          .post("/api/products")
          .set('Cookie', [`${cookie.name}=${cookie.value}`])
          .send(mockProduct);
        console.log(response.body.payload)
        expect(response.status).to.equal(200);
        expect(response._body).to.have.property("payload");
      } else {
        console.log('No esta autorizado para crear productos');
      }
    });

    it('Endpoint PUT/api/products/:pid actualiza el producto ', async function () {
      const pid = '64ed64be8d259ffe1ca12845';
      const updatedTitle = "cambiamos";

      const updatedProductData = {
        title: updatedTitle,
      };
      console.log("enelrodelputl", responseBodyRole);
      if (responseBodyRole === "PREMIUM" || responseBodyRole === "ADMIN") {
      const response = await requester
        .put(`/api/products/${pid}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send(updatedProductData);
        expect(response.status).to.equal(200);
        console.log(response)
    //console.log(response.body.payload)
   
      }else{
        console.log('No esta autorizado a realizar dicho cambio')
      }
    });

    it('Endpoint GET /api/products/:pid debera traer correctamente el producto ', async function () {
      const pid = '64ed64be8d259ffe1ca12845';
      const response = await requester.get(`/api/products/${pid}`);
      const responseBody = response.body;
      console.log(responseBody);
    });
  });
});
