pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract CrowdFunding {
    using SafeMath for uint256;

    // 기존 프로젝트 목록
    Project[] private projects;

    // 새로운 프로젝트가 시작될 때마다 발생하는 이벤트
    event ProjectStarted(
        address contractAddress,
        address projectStarter,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 goalAmount
    );

    /** @dev 새로운 프로젝트를 시작하는 함수
     * @param title 생성될 프로젝트의 제목
     * @param description 프로젝트에 대한 간단한 설명
     * @param durationInDays 프로젝트의 기한(일 단위)
     * @param amountToRaise 목표 금액(wei) 
     */
    function startProject(
        string calldata title,
        string calldata description,
        uint256 durationInDays,
        uint256 amountToRaise
    ) external {
        uint256 raiseUntil = now.add(durationInDays.mul(1 days));
        Project newProject = new Project(
            msg.sender,
            title,
            description,
            raiseUntil,
            amountToRaise
        );
        projects.push(newProject);
        emit ProjectStarted(
            address(newProject),
            msg.sender,
            title,
            description,
            raiseUntil,
            amountToRaise
        );
    }

    /** @dev 모든 프로젝트의 컨트랙트 주소를 반환하는 함수
     * @return 모든 프로젝트의 컨트랙트 주소 목록
     */
    function returnAllProjects() external view returns (Project[] memory) {
        return projects;
    }
}

contract Project {
    using SafeMath for uint256;

    // 데이터 구조
    enum State {
        Fundraising,
        Expired,
        Successful
    }

    // 상태 변수
    address payable public creator;
    uint256 public amountGoal; // 목표 금액. 이를 달성하지 못하면 모든 참여자에게 환불됨
    uint256 public completeAt;
    uint256 public currentBalance;
    uint256 public raiseBy;
    string public title;
    string public description;
    State public state = State.Fundraising; // 생성 시 초기화
    mapping(address => uint256) public contributions;

    // 펀딩을 받았을 때 발생하는 이벤트
    event FundReceived(
        address contributor,
        uint256 amount,
        uint256 currentTotal
    );
    // 프로젝트 시작자가 자금을 받았을 때 발생하는 이벤트
    event CreatorPaid(address recipient);

    // 현재 상태를 확인하기 위한 modifier
    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    // 함수 호출자가 프로젝트 시작자인지 확인하기 위한 modifier
    modifier isCreator() {
        require(msg.sender == creator);
        _;
    }

    constructor(
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint256 fundRaisingDeadline,
        uint256 goalAmount
    ) public {
        creator = projectStarter;
        title = projectTitle;
        description = projectDesc;
        amountGoal = goalAmount;
        raiseBy = fundRaisingDeadline;
        currentBalance = 0;
    }

    /** @dev 특정 프로젝트에 기부하는 함수
     */
    function contribute() external payable inState(State.Fundraising) {
        require(msg.sender != creator);
        contributions[msg.sender] = contributions[msg.sender].add(msg.value);
        currentBalance = currentBalance.add(msg.value);
        emit FundReceived(msg.sender, msg.value, currentBalance);
        checkIfFundingCompleteOrExpired();
    }

    /** @dev 조건에 따라 프로젝트 상태를 변경하는 함수
     */
    function checkIfFundingCompleteOrExpired() public {
        if (currentBalance >= amountGoal) {
            state = State.Successful;
            payOut();
        } else if (now > raiseBy) {
            state = State.Expired;
        }
        completeAt = now;
    }

    /** @dev 받은 자금을 프로젝트 시작자에게 지급하는 함수
     */
    function payOut() internal inState(State.Successful) returns (bool) {
        uint256 totalRaised = currentBalance;
        currentBalance = 0;

        if (creator.send(totalRaised)) {
            emit CreatorPaid(creator);
            return true;
        } else {
            currentBalance = totalRaised;
            state = State.Successful;
        }

        return false;
    }

    /** @dev 프로젝트가 만료되었을 때 기부금을 환불받는 함수
     */
    function getRefund() public inState(State.Expired) returns (bool) 
    {
        require(contributions[msg.sender] > 0);

        uint256 amountToRefund = contributions[msg.sender];
        contributions[msg.sender] = 0;

        if (!msg.sender.send(amountToRefund)) {
            contributions[msg.sender] = amountToRefund;
            return false;
        } else {
            currentBalance = currentBalance.sub(amountToRefund);
        }

        return true;
    }

    /** @dev 프로젝트에 대한 특정 정보를 가져오는 함수
     * @return 프로젝트의 모든 세부 정보
     */
    function getInfo()
        public
        returns (
            address payable projectStarter,
            string memory projectTitle,
            string memory projectDesc,
            uint256 deadline,
            State currentState,
            uint256 currentAmount,
            uint256 goalAmount
        )
    {
        projectStarter = creator;
        projectTitle = title;
        projectDesc = description;
        deadline = raiseBy;
        currentState = state;
        currentAmount = currentBalance;
        goalAmount = amountGoal;
    }
}
